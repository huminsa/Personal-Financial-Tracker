<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ReportsExport implements FromArray, WithHeadings, WithTitle
{
    protected $data;
    protected $reportType;

    public function __construct($data, $reportType)
    {
        $this->data = $data;
        $this->reportType = $reportType;
    }

    public function array(): array
    {
        // Convert data to array format for Excel
        $rows = [];
        
        switch ($this->reportType) {
            case 'overview':
                $rows[] = ['Total Income', $this->data['total_income'] ?? 0];
                $rows[] = ['Total Expense', $this->data['total_expense'] ?? 0];
                $rows[] = ['Net Flow', $this->data['net_flow'] ?? 0];
                $rows[] = [];
                $rows[] = ['Category', 'Amount', 'Percentage'];
                
                if (isset($this->data['expense_by_category'])) {
                    foreach ($this->data['expense_by_category'] as $cat) {
                        $rows[] = [$cat['name'], $cat['amount'], $cat['percentage'] . '%'];
                    }
                }
                break;
                
            case 'monthly_trends':
                if (isset($this->data['monthly_trends']['data'])) {
                    foreach ($this->data['monthly_trends']['data'] as $month) {
                        $rows[] = [
                            $month['month'],
                            $month['income'],
                            $month['expense'],
                            $month['savings']
                        ];
                    }
                }
                break;
                
            case 'spending_category':
                if (isset($this->data['spending_categories']['data'])) {
                    foreach ($this->data['spending_categories']['data'] as $cat) {
                        $rows[] = [
                            $cat['name'],
                            $cat['amount'],
                            $cat['count'],
                            $cat['average'],
                            $cat['percentage'] . '%'
                        ];
                    }
                }
                break;
                
            case 'budget_actuals':
                if (isset($this->data['budget_actuals']['data'])) {
                    foreach ($this->data['budget_actuals']['data'] as $budget) {
                        $rows[] = [
                            $budget['category_name'],
                            $budget['budget_amount'],
                            $budget['actual_amount'],
                            $budget['difference'],
                            $budget['status']
                        ];
                    }
                }
                break;
                
            case 'net_worth':
                $rows[] = ['Total Assets', $this->data['total_assets'] ?? 0];
                $rows[] = ['Total Liabilities', $this->data['total_liabilities'] ?? 0];
                $rows[] = ['Net Worth', $this->data['net_worth'] ?? 0];
                break;
        }
        
        return $rows;
    }

    public function headings(): array
    {
        switch ($this->reportType) {
            case 'monthly_trends':
                return ['Month', 'Income', 'Expense', 'Savings'];
            case 'spending_category':
                return ['Category', 'Amount', 'Transactions', 'Average', 'Percentage'];
            case 'budget_actuals':
                return ['Category', 'Budget', 'Actual', 'Difference', 'Status'];
            default:
                return ['Item', 'Value'];
        }
    }

    public function title(): string
    {
        return ucfirst(str_replace('_', ' ', $this->reportType));
    }
}
