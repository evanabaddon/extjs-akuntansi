<?php

namespace App\Controllers;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class BayarPembelian extends BaseController
{
	use ResponseTrait;

    public function getNoBukti()
    {
        $model = new \App\Models\JurnalSrb();

        $tipe = $this->request->getVar('tipe');
        $prefix = [
            'BKK' => 'KK',
            'BBK' => 'BK'
        ];

        $table = "(SELECT MAX(RIGHT(nobukti, 5))+1 last_id FROM jurnal_srb A WHERE tipe_jurnal='".$tipe."' AND LEFT(nobukti, 3)='".$prefix[$tipe]."-') A";
        $data = $model->db->table($table)->get()->getRowArray();

        $last = $data['last_id']<=0?1:$data['last_id'];
        $nobukti = $last;
        for ($i = 0; $i < 5 - strlen($last); $i++) {
            $nobukti = "0" . $nobukti;
        }
    
        $response = [
            'nobukti' => $prefix[$tipe]."-".$nobukti
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
        $tipe      = $this->request->getVar('tipe');

        $tabel     = '(
            SELECT 
                A1.trx_id id,
                A1.nobukti, 
                A1.tanggal, 
                A2.nama subyek, 
                A1.ket2 keterangan,
                IF(A1.tipe_jurnal="BKK", "KAS", "BANK") jenis_trx, 
                SUM(A1.jumlah) total 
            FROM 
                jurnal_srb A1 LEFT JOIN
                vendor A2 ON A1.id_subyek=A2.id 
            WHERE 
                A1.id_subyek!=0 AND
                A1.tanggal BETWEEN "'.$from.'" AND "'.$to.'" AND
                A1.tipe_jurnal IN ('.($tipe=='ALL'?'"BKK","BBK"':'"'.$tipe.'"').') ' .
                ($query!=''?' AND (A1.nobukti LIKE "%'.$query.'%" OR A2.nama LIKE "%'.$query.'%" OR A1.ket2 LIKE "%'.$query.'%") ':'') . '
            GROUP BY 
                A1.nobukti
        ) A';
        
        $builder = $model->db->table($tabel)->select('
			A.id, 
			A.nobukti,
			DATE_FORMAT(A.tanggal, "%d-%m-%Y") tanggal,
			A.subyek,
            A.keterangan,
			A.jenis_trx,
			A.total
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
			A.kk rekeningheader,
            A.id_subyek subyek, 
            ket2 uraian,

            A.id,

            A.id_ref id_pembelian,
            A.noref notrx_pembelian,

            A.kd kode_akun,
            CONCAT(B.kode_akun, \' - \', B.nama_akun) detail_akun,
            ket keterangan,
            A.volume qty,
            A.jumlah_a harga,
            A.jumlah
		');
        $builder->join('rekening B', 'B.kode_akun=A.kd', 'LEFT');
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
				'message' => 'Hapus bayar pembelian berhasil.'
			];

			return $this->respond($response, 200);
		} else {
			$response = [
				'success' => false,
				'message' => 'Proses hapus bayar pembelian gagal.'
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
                'jenis'         => 'Kredit',
                'nobukti'       => $this->request->getPost('nobukti'),
                
                'id_ref'        => $cols[0],
                'noref'         => $cols[1],

                'kd'            => $cols[2],
                'kk'            => $this->request->getPost('rekeningheader'),
                
                'ket'            => $cols[4],
                'ket2'           => $this->request->getPost('uraian'),
                
                'id_subyek'     => $this->request->getPost('subyek'),
                'subyek'        => $vendor['nama'],

                'jumlah_subyek' => 1,
                'volume'        => $cols[5],
                'satuan'        => 'Rupiah',
                'jumlah_a'      => $cols[6],
                'jumlah'        => $cols[7],

                'tipe_jurnal'   => $this->request->getPost('jenistransaksi'),

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
			'message' => 'Tambah bayar pembelian berhasil.'
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
                'jenis'         => 'Kredit',
                'nobukti'       => $this->request->getPost('nobukti'),
                
                'id_ref'        => $cols[0],
                'noref'         => $cols[1],

                'kd'            => $cols[2],
                'kk'            => $this->request->getPost('rekeningheader'),
                
                'ket'            => $cols[4],
                'ket2'           => $this->request->getPost('uraian'),
                
                'id_subyek'     => $this->request->getPost('subyek'),
                'subyek'        => $vendor['nama'],

                'jumlah_subyek' => 1,
                'volume'        => $cols[5],
                'satuan'        => 'Rupiah',
                'jumlah_a'      => $cols[6],
                'jumlah'        => $cols[7],

                'tipe_jurnal'   => $this->request->getPost('jenistransaksi'),

                'date_create'    => $date->format('Y-m-d H:i:s'),
                'user_create'    => 0,
                'date_update'    => $date->format('Y-m-d H:i:s'),
                'user_update'    => 0
            ];

            $model->insert($_DATA);
        }
        
		$response = [
			'success' => true,
			'message' => 'Update bayar pembelian berhasil.'
		];
		return $this->respond($response, 200);
	}
}
