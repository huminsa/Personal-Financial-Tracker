<?php
// app/Policies/AccountPolicy.php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy
{
    public function view(User $user, Account $account)
    {
        return $account->user_id === $user->id;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, Account $account)
    {
        return $account->user_id === $user->id;
    }

    public function delete(User $user, Account $account)
    {
        return $account->user_id === $user->id;
    }
}