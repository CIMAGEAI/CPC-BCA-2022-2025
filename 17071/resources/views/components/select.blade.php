<div>
    @if ($label != false)
        <label for="{{ $id }}" class="form-label m-0">{{ $label }}</label>
    @endif
    @if (!$placeholder)
        {!! html()->select($name, $list, $value)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->id($id)->attributes($inputAttribute)->attribute('label', $placeholderSelect2) !!}
    @else
        {!! html()->select($name, $list, $value)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->placeholder($placeholder)->id($id)->attributes($inputAttribute)->attribute('label', $placeholderSelect2) !!}
    @endif

    <span id="{{ 'err_' . $id }}" class="errorText"></span>
    @error($errorKey)
        <span class="errorText">{{ $message }}</span>
    @enderror

</div>
