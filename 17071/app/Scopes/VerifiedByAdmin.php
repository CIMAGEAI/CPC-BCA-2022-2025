<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class VerifiedByAdmin implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('verify_by_Admin', '!=', 'Rejected')->Where('verify_by_Admin', '!=','Pending');
    }
}
