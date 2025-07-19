<div>
    <div class="form-floating form-floating-outline">
        {!! html()->textarea($name, $value)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->placeholder($placeholder)->id($id)->attribute('style', 'height:100px;')->attributes($attributes) !!}
        {!! html()->label($label)->for($name) !!}
        <span id="{{ 'err_' . $id }}" class="errorText"></span>
        @error($errorKey)
            <span class="errorText">{{ $message }}</span>
        @enderror
    </div>
</div>
