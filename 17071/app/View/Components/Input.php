<?php

namespace App\View\Components;

use App\Utils\UtilityHelper;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Input extends Component
{

    public $name;
    public $value;
    public $id;
    public $class;
    public $label;
    public $placeholder;
    public $errorKey;
    public $attributes;
    public $oninput;

    /**
     * Create a new component instance.
     */
    public function __construct($name, $value = null, $id = 'add', $class = ' form-control', $label = true, $placeholder = true,$oninput=null, array $attributes = [])
    {
        $this->name = $name;
        $this->value = $value;
        $this->id = $id . '-' . UtilityHelper::convertNameToId($name);
        $this->class = $class;
        $this->label = is_string($label) ? $label : ($label !== false ? UtilityHelper::convertToReadable($name) : null);
        $this->placeholder = is_string($placeholder) ? $placeholder : ($placeholder !== false ? 'Enter ' . UtilityHelper::convertToReadable($name) : null);
        $this->errorKey = UtilityHelper::transformNameToErrorKey($name);
        $this->attributes = $attributes;

        $this->oninput = $oninput;
    }
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {

        return view('components.input');
    }
}
