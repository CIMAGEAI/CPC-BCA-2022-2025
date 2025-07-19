<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class StudentRequest extends FormRequest
{
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
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['required', 'string', 'max:255'],

            'roll_no' => ['required', 'integer'],
            'class' => ['required', 'string', 'max:50'],
            'dob' => ['required', 'date'],
            'admission_date' => ['required', 'date'],

            'gender' => ['required', 'in:male,female,other'],
            'category' => ['nullable', 'string', 'max:255'],
            'mobile_no' => ['nullable', 'string', 'regex:/^[0-9]{10}$/'],
            'second_mobile_no' => ['nullable', 'string', 'regex:/^[0-9]{10}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'religion' => ['nullable', 'string', 'max:255'],
            'cast' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'pincode' => ['nullable', 'string', 'regex:/^[1-9][0-9]{5}$/'],
            'photo' => ['nullable', 'file', 'mimes:jpg,png,webp,svg', 'max:2024'],
        ];
    }

    public function rulesForStore(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['required', 'string', 'max:255'],

            'roll_no' => ['required', 'integer'],
            'class' => ['required', 'string', 'max:50'],
            'dob' => ['required', 'date'],
            'admission_date' => ['required', 'date'],
            'gender' => ['required', 'in:male,female,other'],
            'category' => ['nullable', 'string', 'max:255'],
            'mobile_no' => ['nullable', 'string', 'regex:/^[0-9]{10}$/'],
            'second_mobile_no' => ['nullable', 'string', 'regex:/^[0-9]{10}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'religion' => ['nullable', 'string', 'max:255'],
            'cast' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'pincode' => ['nullable', 'string', 'regex:/^[1-9][0-9]{5}$/'],
            'photo' => ['nullable', 'file', 'mimes:jpg,png,webp,svg', 'max:2024'],
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
