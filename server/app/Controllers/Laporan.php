<?php

namespace App\Controllers;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class Laporan extends BaseController
{
	use ResponseTrait;
	
    public function jurnal() {
        $db = \Config\Database::connect();

        $from      = $this->request->getVar('from');
		$to        = $this->request->getVar('to');
        $tipe      = $this->request->getVar('tipe');
		$nama_tipe = $this->request->getVar('nama_tipe');
        
        $sql = 'CALL `lap_akunting_jurnal`(\''.$from.'\', \''.$to.'\', \''.$tipe.'\', \''.$nama_tipe.'\')';        
        $data = $db->query($sql)->getResultArray();

        $response = [
            'total' => count($data),
            'data' => $data
        ];

        return $this->respond($response, 200);
    }
}