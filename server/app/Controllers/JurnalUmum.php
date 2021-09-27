<?php

namespace App\Controllers;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class JurnalUmum extends BaseController
{
	use ResponseTrait;

    public function getNoBukti()
    {
        $model = new \App\Models\JurnalSrb();

        $table = "(SELECT MAX(RIGHT(nobukti, 5))+1 last_id FROM jurnal_srb WHERE tipe_jurnal='JUM' AND LEFT(nobukti, 3)='JU-') A";
        $data = $model->db->table($table)->get()->getRowArray();

        $last = $data['last_id']<=0?1:$data['last_id'];
        $nobukti = $last;
        for ($i = 0; $i < 5 - strlen($last); $i++) {
            $nobukti = "0" . $nobukti;
        }
    
        $response = [
            'nobukti' => "JU-".$nobukti
        ];
            
		return $this->respond($response, 200);
    }
	
    public function index()
    {
        $model = new \App\Models\JurnalSrb();
        
        $page      = $this->request->getVar('page');
		$start     = $this->request->getVar('start');
		$limit     = $this->request->getVar('limit');
		$query     = $this->request->getVar('query');
		$from      = $this->request->getVar('from');
		$to        = $this->request->getVar('to');

        $tabel     = '(
            SELECT 
                A1.trx_id id,
                A1.nobukti, 
                A1.tanggal, 
                A1.jenis,
                IF(A1.jenis="Debet", A1.ket, A1.ket2) keterangan,
                SUM(A1.jumlah) jumlah,
                A1.tipe_jurnal 
            FROM 
                jurnal_srb A1
            WHERE 
                A1.tipe_jurnal="JUM" AND
                A1.tanggal BETWEEN "'.$from.'" AND "'.$to.'" ' .
                ($query!=''?' AND (A1.nobukti LIKE "%'.$query.'%" OR IF(A1.jenis="Debet", A1.ket, A1.ket2) LIKE "%'.$query.'%") ':'') . '
            GROUP BY 
                A1.nobukti
        ) A';
        
        $builder = $model->db->table($tabel)->select('
			A.id, 
			A.nobukti,
			DATE_FORMAT(A.tanggal, "%d-%m-%Y") tanggal,
			A.jenis,
            A.keterangan,
			A.jumlah,
			A.tipe_jurnal
        ');
		$builder->orderBy('A.tanggal', 'DESC');
		$builder->limit($limit, $start);
		//$data = $builder->getCompiledSelect();
		$data = $builder->get()->getResultArray();
            
        $builder = $model->db->table($tabel)->select('COUNT(*) total');
        //$total = $builder->getCompiledSelect();
		$total = $builder->get()->getRowArray();
		$total = $total['total'];

		$response = [
            'total' => $total,
            'data' => $data
        ];
            
		return $this->respond($response, 200);
    }

    public function load($trx_id) {
        $model = new \App\Models\JurnalSrb();

        $builder = $model->db->table('jurnal_srb A');
        
        $builder->select('
			A.trx_id,
			A.nobukti,
			DATE_FORMAT(A.tanggal, "%d-%m-%Y") tanggal,
            A.jenis,
			IF(A.jenis="Debet", A.kd, A.kk) rekeningheader,
            IF(A.jenis="Debet", A.ket, A.ket2) uraian,

            A.id,
            
            IF(A.jenis="Debet", A.kk, A.kd) kode_akun,
            CONCAT(B.kode_akun, \' - \', B.nama_akun) detail_akun,
            IF(A.jenis="Debet", A.ket2, A.ket) keterangan,
            A.volume qty,
            A.jumlah_a harga,
            A.jumlah
		');
        $builder->join('rekening B', 'B.kode_akun=IF(A.jenis="Debet", A.kk, A.kd)', 'LEFT');
		$builder->where('A.trx_id', $trx_id);
		$detail = $builder->get()->getResultArray();
		if($detail) {
            $data = $detail[0];
            $data['id'] = $trx_id;
            $data['total'] = 0;
            foreach ($detail as $value) {
                $data['total']+=$value['jumlah'];
            }

			$response = [
				'success' => true,
        		'data' => $data,
				'detail' => $detail
			];

			return $this->respond($response, 200);	
		} else {
			$response = [
				'success' => false,
        		'message' => 'Data tidak ditemukan.'
			];

			return $this->respond($response, 500);
		}
    }

    public function delete($trx_id) {
		$model = new \App\Models\JurnalSrb();
		
		$delete = $model->whereIn('trx_id', explode(',', $trx_id))->delete();
		if($delete) {
			$response = [
				'success' => true,
				'message' => 'Hapus jurnal umum berhasil.'
			];

			return $this->respond($response, 200);
		} else {
			$response = [
				'success' => false,
				'message' => 'Proses hapus jurnal umum gagal.'
			];

			return $this->respond($response, 500);
		}
	}

    public function insert() {
		$model = new \App\Models\JurnalSrb();
		
        //CEK DUPLIKAT NO BUKTI 
        $builder = $model->select('COUNT(*) TOTAL')->where('nobukti', $this->request->getPost('nobukti'));
		$check = $builder->get()->getRowArray();
		if($check['TOTAL']>0) {
			$response = [
				'success' => false,
				'message' => 'No. Bukti sudah terpakai.'
			];
			return $this->respond($response, 500);
		}

        $date = new \DateTime('now', new \DateTimeZone('Asia/Jakarta'));
        $session    = \Config\Services::session();
		$user_login = $session->get('user');

        //GET VENDOR
        $mdl_vendor = new \App\Models\Vendor();
        $vendor = $mdl_vendor->where('id', $this->request->getPost('subyek'))->get()->getRowArray();

        $detail = $this->request->getPost('detail');
        $rows = explode(';', $detail);
        $trx_id = 0;
        foreach($rows as $value) {
            $cols = explode(',', $value);
            $_DATA = [
                'trx_id'        => $trx_id,

                'tanggal'       => $this->request->getPost('tanggal'),
                'jenis'         => $this->request->getPost('jenis'),
                'nobukti'       => $this->request->getPost('nobukti'),
                
                'id_ref'        => '',
                'noref'         => '',

                'kd'            => $this->request->getPost('jenis')=='Debet'?$this->request->getPost('rekeningheader'):$cols[0],
                'kk'            => $this->request->getPost('jenis')=='Debet'?$cols[0]:$this->request->getPost('rekeningheader'),
                
                'ket'            => $this->request->getPost('jenis')=='Debet'?$this->request->getPost('uraian'):$cols[2],
                'ket2'           => $this->request->getPost('jenis')=='Debet'?$cols[2]:$this->request->getPost('uraian'),
                
                'id_subyek'     => 0,
                'subyek'        => '',

                'jumlah_subyek' => 1,
                'volume'        => 1,
                'satuan'        => 'Rupiah',
                'jumlah_a'      => $cols[3],
                'jumlah'        => $cols[3],

                'tipe_jurnal'   => 'JUM',

                'date_create'   => $date->format('Y-m-d H:i:s'),
                'user_create'   => 0,
                'date_update'   => $date->format('Y-m-d H:i:s'),
                'user_update'   => 0
            ];

            $insert = $model->insert($_DATA);
            if($insert && $trx_id==0) {
                $trx_id = $insert;
            }
        }
        $model->where(['id' => $trx_id, 'trx_id' => 0])->set(['trx_id' => $trx_id])->update();

		$response = [
			'success' => true,
			'message' => 'Tambah jurnal umum berhasil.'
		];
		return $this->respond($response, 200);
	}

	public function update($trx_id) {
		
		$model = new \App\Models\JurnalSrb();
		
        //CEK DUPLIKAT NO BUKTI 
        $builder = $model->select('COUNT(*) TOTAL')->where(['nobukti' => $this->request->getPost('nobukti'), 'trx_id !=' => $trx_id]);
		$check = $builder->get()->getRowArray();
		if($check['TOTAL']>0) {
			$response = [
				'success' => false,
				'message' => 'No. Bukti sudah terpakai.'
			];
			return $this->respond($response, 500);
		}

        $date = new \DateTime('now', new \DateTimeZone('Asia/Jakarta'));
        $session    = \Config\Services::session();
		$user_login = $session->get('user');

        //GET VENDOR
        $mdl_vendor = new \App\Models\Vendor();
        $vendor = $mdl_vendor->where('id', $this->request->getPost('subyek'))->get()->getRowArray();

        $detail = $this->request->getPost('detail');
        $rows = explode(';', $detail);
        $delete = $model->where('trx_id', $trx_id)->delete();
        foreach($rows as $value) {
            $cols = explode(',', $value);
            $_DATA = [
                'trx_id'       => $trx_id,

                'tanggal'       => $this->request->getPost('tanggal'),
                'jenis'         => $this->request->getPost('jenis'),
                'nobukti'       => $this->request->getPost('nobukti'),
                
                'id_ref'        => '',
                'noref'         => '',

                'kd'            => $this->request->getPost('jenis')=='Debet'?$this->request->getPost('rekeningheader'):$cols[0],
                'kk'            => $this->request->getPost('jenis')=='Debet'?$cols[0]:$this->request->getPost('rekeningheader'),
                
                'ket'            => $this->request->getPost('jenis')=='Debet'?$this->request->getPost('uraian'):$cols[2],
                'ket2'           => $this->request->getPost('jenis')=='Debet'?$cols[2]:$this->request->getPost('uraian'),
                
                'id_subyek'     => 0,
                'subyek'        => '',

                'jumlah_subyek' => 1,
                'volume'        => 1,
                'satuan'        => 'Rupiah',
                'jumlah_a'      => $cols[3],
                'jumlah'        => $cols[3],

                'tipe_jurnal'   => 'JUM',

                'date_create'    => $date->format('Y-m-d H:i:s'),
                'user_create'    => 0,
                'date_update'    => $date->format('Y-m-d H:i:s'),
                'user_update'    => 0
            ];

            $model->insert($_DATA);
        }
        
		$response = [
			'success' => true,
			'message' => 'Update jurnal umum berhasil.'
		];
		return $this->respond($response, 200);
	}
}
