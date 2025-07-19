<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class card extends Component
{
    public $bgColor;
    public $name;
    public $date;
    public $value;
    public $img;
    public $width;



    public function __construct($bgColor='#fff', $name='Customer', $date='today', $value="12.0", $img='img/illustrations/pricing-basic.png',$width=125)
    {
        $this->bgColor = $bgColor;
        $this->name = $name;
        $this->date = $date;
        $this->value = $value;
        $this->img = $img;
        $this->width = $width;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render()
    {
        return view('components.card');
    }
}
