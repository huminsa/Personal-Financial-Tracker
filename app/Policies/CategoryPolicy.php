<?php
// app/Policies/CategoryPolicy.php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    public function view(User $user, Category $category)
    {
        return $category->user_id === $user->id || $category->is_default;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, Category $category)
    {
        return $category->user_id === $user->id && !$category->is_default;
    }

    public function delete(User $user, Category $category)
    {
        return $category->user_id === $user->id && !$category->is_default;
    }
}