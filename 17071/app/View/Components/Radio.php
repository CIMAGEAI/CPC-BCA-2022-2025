<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Radio extends Component
{

    public $name;
    public $value;
    public $checked;
    public $label;
    public $id;
    /**
     * Create a new component instance.
     */
    public function __construct($name, $value, $label, $id, $checked = '')
    {
        $this->name = $name;
        $this->value = $value;
        $this->id = $id;
        $this->checked = $checked;
        $this->label = $label;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.radio');
    }
}
