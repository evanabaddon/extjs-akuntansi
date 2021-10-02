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

    public function bukuBesar() {
        $db = \Config\Database::connect();

        $from      = $this->request->getVar('from');
		$to        = $this->request->getVar('to');
        $kode_akun = $this->request->getVar('kode_akun');
        
        $sql = 'CALL `lap_akunting_bukubesar`(\''.$from.'\', \''.$to.'\', \''.$kode_akun.'\')';        
        $data = $db->query($sql)->getResultArray();

        $response = [
            'total' => count($data),
            'data' => $data
        ];

        return $this->respond($response, 200);
    }

    public function neracaSaldo() {

        $db = \Config\Database::connect();

        $from      = $this->request->getVar('from');
		$to        = $this->request->getVar('to');

        $sql = 'CALL `lap_akunting_neraca_saldo`(\''.$from.'\', \''.$to.'\')';        
        $data = $db->query($sql)->getResultArray();

        $result = [];
        $index_lv_2 = -1;
        $index_lv_3 = -1;
        foreach($data as $i => $value) {
            if($value['level'] == 2) {
                $value['expanded'] = true;
                $value['children'] = [];
                array_push($result, $value);
                $index_lv_2++;
                $index_lv_3 = -1;
            }

            if($value['level'] == 3) {               
                
                $value['expanded'] = true;
                $value['children'] = [];
                array_push($result[$index_lv_2]['children'], $value);
                $index_lv_3++;
            }

            if($value['level'] == 4) {
                $value['leaf'] = true;
                array_push($result[$index_lv_2]['children'][$index_lv_3]['children'], $value);
            }
        }

        $response = [
            'text' => 'root',
            'children' => $result
        ];

        return $this->respond($response, 200);
    }
}