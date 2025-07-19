<div>
    @if ($label != false)
        <label for="{{ $id }}" class="form-label m-0">{{ $label }}</label>
    @endif
    {!! html()->file($name)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->id($id)->attributes($attributes) !!}
    <span id="{{ 'err_' . $id }}" class="errorText"></span>
    @error($errorKey)
        <span class="errorText">{{ $message }}</span>
    @enderror
</div>
