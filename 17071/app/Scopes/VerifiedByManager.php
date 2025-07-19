<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class VerifiedByManager implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('verify_by_manager', '!=', 'Rejected')->Where('verify_by_manager', '!=','Pending')->orWhereNull('verify_by_manager');
    }
}
