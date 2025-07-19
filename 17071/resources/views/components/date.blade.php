<div>
    @if ($label !== false)
        <label for="{{ $id }}" class="form-label m-0">{{ $label }}</label>
    @endif
    {!! html()->date($name, $value, true)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->attributes($attributes)->placeholder($placeholder)->id($id) !!}
    <span id="{{ 'err_' . $id }}" class="errorText"></span>
    @error($errorKey)
        <span class="errorText">{{ $message }}</span>
    @enderror
</div>
