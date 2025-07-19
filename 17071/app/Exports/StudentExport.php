<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use App\Scopes\BlockStatusScope;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentExport implements  FromCollection, WithHeadings, WithMapping
{
    protected $classes;

    public function __construct($classes)
    {
        $this->classes = $classes;
    }
    public function collection()
    {
        if ($this->classes === 'all') {
            return Student::withoutGlobalScope(BlockStatusScope::class)->get();
        }

        return Student::where('class', $this->classes)
            ->withoutGlobalScope(BlockStatusScope::class)
            ->get();
    }

    /**
     * Define custom headers for the CSV export.
     */
    public function headings(): array
    {
        return [
            'Admission No',
            'Student Name',
            'Father Name',
            'Mobile No',
            'Email',
            'Gender',
            'Roll No',
            'Class',
        ];
    }

    /**
     * Map the student data for each row in the CSV.
     */
    public function map($student): array
    {
        return [
            $student->admission_no,
            $student->name,
            $student->father_name,
            $student->mobile_no ?? 'N/A',
            $student->email ?? 'N/A',
            $student->gender ?? 'N/A',
            $student->roll_no ?? 'N/A',
            $student->class ?? 'N/A',
        ];
    }
}
