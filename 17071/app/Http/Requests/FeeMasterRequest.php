<?php

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class FeeMasterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */


    public function rules(): array
    {
        switch ($this->method()) {
            case 'POST':
                return $this->rulesForStore();
            case 'PUT':
                return $this->rulesForUpdate();
            default:
                return [];
        }
    }


    public function rulesForUpdate(): array
    {
        $id = $this->route('student');
        return [
            'class' => ['required', 'string', 'max:50'],
            'month' => ['required'],
            'feeType' => ['required'],
            'fee' => ['required','numeric'],
        ];
    }

    public function rulesForStore(): array
    {
        return [
            'class' => ['required', 'string', 'max:50'],
            'month' => ['required'],
            'feeType' => ['required'],
            'fee' => ['required','numeric'],
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        if ($this->expectsJson()) {
            throw new HttpResponseException(response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        throw (new ValidationException($validator))
            ->errorBag($this->errorBag)
            ->redirectTo($this->getRedirectUrl());
    }
}
