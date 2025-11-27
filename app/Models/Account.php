<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'name', 'type', 'balance', 'color', 
        'is_default', 'include_in_net_worth', 'description'
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'is_default' => 'boolean',
        'include_in_net_worth' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fromTransactions()
    {
        return $this->hasMany(Transaction::class, 'from_account_id');
    }

    public function toTransactions()
    {
        return $this->hasMany(Transaction::class, 'to_account_id');
    }

    public function calculateBalance()
    {
        $income = $this->fromTransactions()->where('type', 'income')->sum('amount');
        $expense = $this->fromTransactions()->where('type', 'expense')->sum('amount');
        $transferOut = $this->fromTransactions()->where('type', 'transfer')->sum('amount');
        $transferIn = $this->toTransactions()->where('type', 'transfer')->sum('amount');

        return $income - $expense - $transferOut + $transferIn;
    }
}
