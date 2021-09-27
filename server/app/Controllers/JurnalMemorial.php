<?php

namespace App\Controllers;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class JurnalMemorial extends BaseController
{
	use ResponseTrait;

    public function getNoBukti()
    {
        $model = new \App\Models\Jurnal();

        $table = "(SELECT MAX(RIGHT(nobukti, 5))+1 last_id FROM jurnal WHERE tipe_jurnal='JMM' AND LEFT(nobukti, 3)='JM-') A";
        $data = $model->db->table($table)->get()->getRowArray();

        $last = $data['last_id']<=0?1:$data['last_id'];
        $nobukti = $last;
        for ($i = 0; $i < 5 - strlen($last); $i++) {
            $nobukti = "0" . $nobukti;
        }
    
        $response = [
            'nobukti' => "JM-".$nobukti
        ];
            
		return $this->respond($response, 200);
    }
	
    public function index()
    {
        $model = new \App\Models\Jurnal();
        
        $page      = $this->request->getVar('page');
		$start     = $this->request->getVar('start');
		$limit     = $this->request->getVar('limit');
		$query     = $this->request->getVar('query');
		$from      = $this->request->getVar('from');
		$to        = $this->request->getVar('to');

        $query = 'tanggal BETWEEN "'.$from.'" AND "'.$to.'" ' . ($query!=''?' AND (nobukti LIKE "%'.$query.'%" OR keterangan LIKE "%'.$query.'%") ':'') . '';
        
        $builder = $model->select('
			id, 
			nobukti,
			DATE_FORMAT(tanggal, "%d-%m-%Y") tanggal,
			keterangan,
			total
        ');
        $builder->where($query);
		$builder->orderBy('tanggal', 'DESC');
		$builder->limit($limit, $start);
		//$data = $builder->getCompiledSelect();
		$data = $builder->get()->getResultArray();
            
        $builder = $model->select('COUNT(*) total');
        $builder->where($query);
        //$total = $builder->getCompiledSelect();
		$total = $builder->get()->getRowArray();
		$total = $total['total'];

		$response = [
            'total' => $total,
            'data' => $data
        ];
            
		return $this->respond($response, 200);
    }

    public function load($id) {
        $model = new \App\Models\Jurnal();

        //header
        $builder = $model->select(
            'id, nobukti, DATE_FORMAT(tanggal, "%d-%m-%Y") tanggal, keterangan  uraian'
        )->where('id', $id);
        $data = $builder->get()->getRowArray();

        //detail
        $builder = $model->db->table('jurnal_detail A');
        $builder->select('
			A.id,
            A.kode_akun,
            CONCAT(B.kode_akun, \' - \', B.nama_akun) detail_akun,
            A.keterangan,
            A.debet,
            A.kredit
		');
        $builder->join('rekening B', 'B.kode_akun=A.kode_akun', 'LEFT');
		$builder->where('A.id_jurnal', $id);
		$detail = $builder->get()->getResultArray();
		if($detail) {
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

    public function delete($id) {
		$model = new \App\Models\Jurnal();
		
		$delete = $model->whereIn('id', explode(',', $id))->delete();
		if($delete) {
            $mdl_detail = new \App\Models\JurnalDetail();
            $mdl_detail->whereIn('id_jurnal', explode(',', $id))->delete();

			$response = [
				'success' => true,
				'message' => 'Hapus jurnal memorial berhasil.'
			];

			return $this->respond($response, 200);
		} else {
			$response = [
				'success' => false,
				'message' => 'Proses hapus jurnal memorial gagal.'
			];

			return $this->respond($response, 500);
		}
	}

    public function insert() {
		$model = new \App\Models\Jurnal();
		
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

        //INSERT HEADER
        $_DATA = [
            'nobukti'     => $this->request->getPost('nobukti'),
            'tanggal'     => $this->request->getPost('tanggal'),
            'keterangan'  => $this->request->getPost('uraian'),
            'tipe_jurnal' => 'JMM',
            'total'       => $this->request->getPost('total'),
            'date_create' => $date->format('Y-m-d H:i:s'),
            'user_create' => 0,
            'date_update' => $date->format('Y-m-d H:i:s'),
            'user_update' => 0
        ];
        $id_jurnal = $model->insert($_DATA);

        //INSERT DETAIL
        $mdl_detail = new \App\Models\JurnalDetail();
        $detail = $this->request->getPost('detail');
        $rows = explode(';', $detail);
        foreach($rows as $value) {
            $cols = explode(',', $value);
            $_DATA = [
                'id_jurnal'  => $id_jurnal,
                'kode_akun'  => $cols[0],
                'keterangan' => $cols[2],
                'debet'      => $cols[3],
                'kredit'     => $cols[4]
            ];

            $mdl_detail->insert($_DATA);
        }
        
		$response = [
			'success' => true,
			'message' => 'Tambah jurnal memorial berhasil.'
		];
		return $this->respond($response, 200);
	}

	public function update($id) {
		
		$model = new \App\Models\Jurnal();
		
        //CEK DUPLIKAT NO BUKTI 
        $builder = $model->select('COUNT(*) TOTAL')->where(['nobukti' => $this->request->getPost('nobukti'), 'id !=' => $id]);
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

        //UPDATE HEADER
        $_DATA = [
            'nobukti'     => $this->request->getPost('nobukti'),
            'tanggal'     => $this->request->getPost('tanggal'),
            'keterangan'  => $this->request->getPost('uraian'),
            'tipe_jurnal' => 'JMM',
            'total'       => $this->request->getPost('total'),
            'date_update' => $date->format('Y-m-d H:i:s'),
            'user_update' => 0
        ];
        $model->where('id', $id)->set($_DATA)->update();


        //UPDATE DETAIL
        $mdl_detail = new \App\Models\JurnalDetail();
        $delete = $mdl_detail->where('id_jurnal', $id)->delete();

        $detail = $this->request->getPost('detail');
        $rows = explode(';', $detail);
        foreach($rows as $value) {
            $cols = explode(',', $value);
            $_DATA = [
                'id_jurnal'  => $id,
                'kode_akun'  => $cols[0],
                'keterangan' => $cols[2],
                'debet'      => $cols[3],
                'kredit'     => $cols[4]
            ];
            $mdl_detail->insert($_DATA);
        }
        
		$response = [
			'success' => true,
			'message' => 'Update jurnal memorial berhasil.'
		];
		return $this->respond($response, 200);
	}
}
