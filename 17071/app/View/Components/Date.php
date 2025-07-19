<?php

namespace App\View\Components;

use Closure;
use App\Utils\UtilityHelper;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

class Date extends Component
{
    public $name;
    public $value;
    public $required;
    public $id;
    public $class;
    public $label;
    public $errorKey;
    public $placeholder;
    public $attributes;
    /**
     * Create a new component instance.
     */
    public function __construct($name, $value = null, $required = null, $id = 'add', $class = ' form-control', $label = false, $placeholder = false, array $attributes = [])
    {
        $this->name = $name;
        $this->value = $value;
        $this->id = $id . '-' . UtilityHelper::convertNameToId($name);
        $this->class = $class;
        $this->label = is_string($label) ? $label : ($label !== false ? UtilityHelper::convertToReadable($name) : null);
        $this->errorKey = UtilityHelper::transformNameToErrorKey($name);
        $this->placeholder = is_string($placeholder) ? $placeholder : ($placeholder !== false ? 'Enter ' . UtilityHelper::convertToReadable($name) : null);
        $this->attributes = $attributes;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.date');
    }
}
