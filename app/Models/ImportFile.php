<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportFile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'filename', 'original_name', 'file_path', 'status', 'total_rows', 'processed_rows', 'mapping', 'error_message'];

    protected $casts = [
        'mapping' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
