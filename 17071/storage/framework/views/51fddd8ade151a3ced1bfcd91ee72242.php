<div>
    <?php if($label): ?>
        <label for="<?php echo e($id); ?>" class="form-label m-0"><?php echo e($label); ?></label>
    <?php endif; ?>
    <?php echo html()->password($name, $value)->attributes($attributes)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->placeholder($placeholder)->id($id); ?>

    <span id="<?php echo e('err_' . $id); ?>" class="errorText"></span>
    <?php $__errorArgs = [$errorKey];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
        <span class="errorText"><?php echo e($message); ?></span>
    <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
</div>
<?php /**PATH D:\Project Website\townschool\resources\views/components/password.blade.php ENDPATH**/ ?>