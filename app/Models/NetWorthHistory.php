<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NetWorthHistory extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total_assets', 'total_liabilities', 'net_worth', 'record_date'];

    protected $casts = [
        'total_assets' => 'decimal:2',
        'total_liabilities' => 'decimal:2',
        'net_worth' => 'decimal:2',
        'record_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
