<?php

namespace App\View\Components;

use Closure;
use App\Utils\UtilityHelper;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Log;

class Checkbox extends Component
{

    public $name;
    public $value;
    public $required;
    public $id;
    public $label;
    public $checked;
    public $attributes;
    public $errorKey;
    public $onchange;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $label, $value = null, $required = null, $id = 'add', $checked = null, $attributes = [], $onchange = null)
    {
        $this->name = $name;
        $this->value = $value;
        $this->checked = $checked;
        $this->id = ($id !== 'add') ? $id : $id . '-' . UtilityHelper::convertNameToId($name);
        $this->label = is_string($label) ? $label : ($label !== false ?  UtilityHelper::convertToReadable($name) : null);
        $this->errorKey = UtilityHelper::transformNameToErrorKey($name);
        $this->attributes = $attributes;
        $this->onchange = $onchange;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.checkbox');
    }
}
