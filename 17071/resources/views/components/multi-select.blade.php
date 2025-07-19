<div>
    @if ($label != false)
        <label for="{{ $id }}" class="form-label m-0">{{ $label }}</label>
    @endif
    {!! html()->select($name, $list, $value)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->multiple()->placeholder($placeholder)->id($id)->attributes($inputAttribute)->attribute('label', $placeholderSelect2) !!}
    <span id="{{ 'err_' . $id }}" class="errorText"></span>
    @error($errorKey)
        <span class="errorText">{{ $message }}</span>
    @enderror

</div>
