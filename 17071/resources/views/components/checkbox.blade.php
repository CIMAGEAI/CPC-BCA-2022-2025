<div>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" id="{{ $id }}" name="{{ $name }}"
            {!! $onchange !== null ? 'onchange="' . $onchange . '"' : null !!}" value="{{ $value }}" {{ $checked == $value ? 'checked' : null }} />
        <label class="form-check-label" for="{{ $id }}"> {{ $label }} </label>
    </div>
    <span id="{{ 'err_' . $id }}" class="errorText"></span>
    @error($errorKey)
        <span class="errorText">{{ $message }}</span>
    @enderror
</div>
