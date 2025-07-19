<div>
    <?php if($label != false): ?>
        <label for="<?php echo e($id); ?>" class="form-label m-0"><?php echo e($label); ?></label>
    <?php endif; ?>
    <?php echo html()->file($name)->class($errors->has($errorKey) ? $class . ' is-invalid' : $class)->id($id)->attributes($attributes); ?>

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
<?php /**PATH D:\project\townschool\resources\views/components/file.blade.php ENDPATH**/ ?>