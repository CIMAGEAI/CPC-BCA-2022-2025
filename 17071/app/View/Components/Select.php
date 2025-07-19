<?php

namespace App\View\Components;

use Closure;
use App\Utils\UtilityHelper;
use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

class Select extends Component
{
    public $list;
    public $name;
    public $value;
    public $label;
    public $id;
    public $class;
    public $placeholder;
    public $errorKey;
    public $inputAttribute;
    public $placeholderSelect2;
    public $onChange;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($name, $value = null, $label = null, $id = 'add', $class = '', $placeholder = true, array $attributes = [], $placeholderSelect2 = null, $list = [], $onChange = null)
    {
        $this->name = $name;
        $this->value = $value;
        $this->list = $list;
        $this->label = is_string($label) ? $label : ($label !== false ? UtilityHelper::convertToReadable($name) : null);
        $this->id = $id . '-' . UtilityHelper::convertNameToId($name);
        $this->class = $class . ' form-control form-select';
        $this->placeholder = is_string($placeholder) ? $placeholder : ($placeholder !== false ? 'Choose ' . UtilityHelper::convertToReadable($name) : null);
        $this->errorKey = UtilityHelper::transformNameToErrorKey($name);
        $this->placeholderSelect2 = $placeholderSelect2 ? $placeholderSelect2 : $this->label;
        $this->inputAttribute = $attributes;
        $this->onChange = $onChange;
    }
    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.select');
    }
}
