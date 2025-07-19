<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fee Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 00px;
            padding: 0;
        }

        .receipt-container {
            margin: 0 auto;
            padding: 1px;
        }

        .header {
            text-align: center;
        }

        .header h1 {
            margin: 0px 0;
        }

        .details table {
            width: 100%;
            border-collapse: collapse;
        }

        .details td,
        .details th {
            border: 1px solid #000;
            padding: 4px;
            font-size: 12px;
            text-align: left;
        }
    </style>
</head>

            
<body style="margin: 0!important;padding: 0!important">
    <div class="receipt-container" style="margin: 0!important;padding: 0!important">
        <table>
            <tr>
                <td></td>
                <td>
                  <h1 style="font-size: 15px;margin: 0;padding: 0;text-align: center">BrightMinds Academy</h1>
<p style="font-size: 12px;margin: 0;padding: 0">123 Knowledge Lane, Learning City, Bihar</p>
<p style="font-size: 12px;margin: 0;padding: 0">Estd. - 23 Feb. 2010 | Mob.: 9708195573</p>
   </p>
                </td>
            </tr>
        </table>

        <div class="details">
            <table>

                <tr>
                    <th colspan="4">Student Details</th>
                </tr>
                <tr>
                    <td>Resipt No.</td>
                    <td>{{ $studentFee[0]->resiptNo }}</td>
                    <td>Date</td>
                    <td>{{ $studentFee[0]->created_at->format('d-m-Y') }}</td>
                </tr>
                <tr>
                    <td>Name of the Student</td>
                    <td colspan="3">{{ $studentFee[0]->student->name }}</td>
                </tr>
                <tr>
                    <td>Class</td>
                    <td>{{ $studentFee[0]->student->class }}</td>
                    <td>Sec</td>
                    <td>A</td>
                </tr>
                <tr>
                    <td>Roll No.</td>
                    <td>{{ $studentFee[0]->student->roll_no }}</td>

                    <td>Months</td>
                    <td>{{ implode(', ', $months->unique()->toArray()) }}</td>
                </tr>
            </table>

            <table>
                <tr>
                    <th>Particulars</th>
                    <th>Amount (Rs.)</th>
                </tr>
                <tr>
                    <td>1. Tuition Fee</td>
                    @php
                        $totalFeel = $studentFee
                            ->reject(function ($fee) {
                                return in_array($fee->feeType, ['Development Fee', 'Examination Fee']);
                            })
                            ->sum('fee');

                    @endphp
                    <td>{{ numberFormat($totalFeel) }}</td>
                </tr>

                <tr>
                    <td>2. Admission Fee</td>
                    <td></td>
                </tr>

                <tr>
                    <td>3. Examination</td>
                    <td>{{ numberFormat($examFees?->fee) }} : {{ $examFees?->month }}</td>
                </tr>
                <tr>
                    <td>4. School Dev. Charge</td>
                    <td>{{ numberFormat($developmentFees?->fee) }}</td>
                </tr>
                <tr>
                    <td>5. Festival Fee</td>
                    <td></td>
                </tr>

                <tr>
                    <td>6. Others</td>
                    <td>{{ numberFormat($studentFee->sum('other')) }}</td>
                </tr>
                <tr>
                    <th>Total</th>
                    <th>{{ numberFormat($studentFee->sum('fee') + $studentFee->sum('other')) }}</th>
                </tr>

            </table>
        </div>

        <table style="width: 100%">
            <tr>
                <td>
                    <p style="font-size: 12px;">Note: Date of payment 1st last 10th</p>
                </td>
                <td>
                    <p style="text-align: right;font-size: 12px;">Principal</p>
                </td>
            </tr>
        </table>
        <div class="footer">

        </div>
    </div>
</body>

</html>
