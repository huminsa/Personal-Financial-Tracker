{{-- filepath: d:\laragon\www\denial\resources\views\exports\report.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Report - {{ ucfirst($reportType) }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>{{ ucfirst(str_replace('_', ' ', $reportType)) }} Report</h1>
    <p>Period: {{ $startDate }} to {{ $endDate }}</p>

    @if($reportType === 'overview')
        <div class="summary">
            <p><strong>Total Income:</strong> Rp {{ number_format($data['total_income'] ?? 0, 0, ',', '.') }}</p>
            <p><strong>Total Expense:</strong> Rp {{ number_format($data['total_expense'] ?? 0, 0, ',', '.') }}</p>
            <p><strong>Net Flow:</strong> Rp {{ number_format($data['net_flow'] ?? 0, 0, ',', '.') }}</p>
        </div>

        @if(isset($data['expense_by_category']) && count($data['expense_by_category']) > 0)
            <h2>Expenses by Category</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data['expense_by_category'] as $cat)
                    <tr>
                        <td>{{ $cat['name'] }}</td>
                        <td>Rp {{ number_format($cat['amount'], 0, ',', '.') }}</td>
                        <td>{{ $cat['percentage'] }}%</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endif

    @if($reportType === 'net_worth')
        <div class="summary">
            <p><strong>Total Assets:</strong> Rp {{ number_format($data['total_assets'] ?? 0, 0, ',', '.') }}</p>
            <p><strong>Total Liabilities:</strong> Rp {{ number_format($data['total_liabilities'] ?? 0, 0, ',', '.') }}</p>
            <p><strong>Net Worth:</strong> Rp {{ number_format($data['net_worth'] ?? 0, 0, ',', '.') }}</p>
        </div>
    @endif
</body>
</html>