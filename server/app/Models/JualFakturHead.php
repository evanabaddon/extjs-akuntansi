<?php

namespace App\Models;

use CodeIgniter\Model;

class JualFakturHead extends Model
{
    protected $DBGroup              = 'default';
    protected $table                = 'jual_faktur_head';
    protected $primaryKey           = 'id';
    protected $useAutoIncrement     = true;
    protected $insertID             = 0;
    protected $returnType           = 'array';
    protected $useSoftDeletes       = false;
    protected $protectFields        = true;
    protected $allowedFields        = ['id', 'notrx', 'tanggal', 'id_customer', 'pembayaran', 'jenis_trx', 'no_so', 'keterangan', 'subtotal', 'totalpajak', 'uangmuka', 'voucher', 'total', 'id_jurnal',
                                       'user_create', 'date_create', 'user_update', 'date_update'];

    // Dates
    protected $useTimestamps        = false;
    protected $dateFormat           = 'datetime';
    protected $createdField         = 'created_at';
    protected $updatedField         = 'updated_at';
    protected $deletedField         = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks       = true;
    protected $beforeInsert         = [];
    protected $afterInsert          = [];
    protected $beforeUpdate         = [];
    protected $afterUpdate          = [];
    protected $beforeFind           = [];
    protected $afterFind            = [];
    protected $beforeDelete         = [];
    protected $afterDelete          = [];
}
