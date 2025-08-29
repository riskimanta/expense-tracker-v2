"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DateInput } from "@/components/ui/date-input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useToast } from "@/components/ToastProvider";
import { useIncomeCategories, useIncomeAccounts } from "@/hooks/useIncome";
import { useExpenseCategories, useAccounts as useExpenseAccounts } from "@/hooks/useExpenses";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description?: string;
  type?: string;
  category_id?: string;
  category_name?: string;
  category?: string;  // Add this field
  account_id?: string;
  account_name?: string;
  accountName?: string;  // Add this field
  // Additional fields that might be present
  accountId?: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: string;
    date: string;
    categoryId: string;
    amount: number;
    description: string;
    accountId: string;
    type: string;
  }) => Promise<void>;
}

export function EditTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onSave,
}: EditTransactionDialogProps) {
  const { toast } = useToast();
  
  // Fetch accounts and categories using the same hooks as the create form
  // Use income hooks for income transactions, expense hooks for expense transactions
  const isIncome = transaction?.type === 'INCOME';
  
  const { data: incomeAccounts = [], isLoading: incomeAccountsLoading } = useIncomeAccounts('1');
  const { data: incomeCategories = [], isLoading: incomeCategoriesLoading } = useIncomeCategories();
  
  const { data: expenseAccounts = [], isLoading: expenseAccountsLoading } = useExpenseAccounts('1');
  const { data: expenseCategories = [], isLoading: expenseCategoriesLoading } = useExpenseCategories();
  
  // Use the appropriate data based on transaction type
  const accounts = isIncome ? incomeAccounts : expenseAccounts;
  const categories = isIncome ? incomeCategories : expenseCategories;
  const accountsLoading = isIncome ? incomeAccountsLoading : expenseAccountsLoading;
  const categoriesLoading = isIncome ? incomeCategoriesLoading : expenseCategoriesLoading;
  
  // Debug logging for data loading
  console.log('EditTransactionDialog - Data loading status:', {
    isIncome,
    incomeAccounts: incomeAccounts.length,
    incomeCategories: incomeCategories.length,
    expenseAccounts: expenseAccounts.length,
    expenseCategories: expenseCategories.length,
    selectedAccounts: accounts.length,
    selectedCategories: categories.length
  });
  const [formData, setFormData] = useState({
    date: new Date(),
    type: "EXPENSE",
    accountId: "",
    categoryId: "",
    amount: 0,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when transaction changes
  useEffect(() => {
    console.log('EditTransactionDialog - useEffect triggered:', {
      transaction: !!transaction,
      accountsLoading,
      categoriesLoading,
      accountsCount: accounts.length,
      categoriesCount: categories.length,
      isIncome
    });
    
    if (transaction && !accountsLoading && !categoriesLoading) {
      console.log('EditTransactionDialog - Transaction data:', transaction);
      
      // Try multiple possible field names for account ID
      let accountId = "";
      
      // First, try to get account ID directly
      if (transaction.account_id) {
        accountId = transaction.account_id.toString();
        console.log('EditTransactionDialog - Using direct account_id:', accountId);
      } else if ((transaction as unknown as Record<string, unknown>).accountId) {
        accountId = (transaction as unknown as Record<string, unknown>).accountId?.toString() || '';
        console.log('EditTransactionDialog - Using accountId field:', accountId);
      }
      
      // If still no accountId, try to find it from account name
      if (!accountId && accounts && accounts.length > 0) {
        const accountName = (transaction as unknown as Record<string, unknown>).accountName || (transaction as unknown as Record<string, unknown>).account_name;
        if (accountName) {
                     console.log('EditTransactionDialog - Looking for account by name:', accountName);
          
          const foundAccount = accounts.find((acc: Record<string, unknown>) => 
            acc.name === accountName || 
            (acc.name as string)?.toLowerCase() === (accountName as string)?.toLowerCase()
          );
          
          if (foundAccount) {
            accountId = foundAccount.id.toString();
            console.log('EditTransactionDialog - Found account ID from name:', accountId);
          } else {
            console.log('EditTransactionDialog - Account not found in accounts list');
          }
        }
      }
                       
      // Try multiple possible field names for category ID
      let categoryId = "";
      
      // First, try to get category ID directly
      if (transaction.category_id) {
        categoryId = transaction.category_id.toString();
        console.log('EditTransactionDialog - Using direct category_id:', categoryId);
      } else if ((transaction as unknown as Record<string, unknown>).categoryId) {
        categoryId = (transaction as unknown as Record<string, unknown>).categoryId?.toString() || '';
        console.log('EditTransactionDialog - Using categoryId field:', categoryId);
      }
      
      // If still no categoryId, try to find it from category name
      if (!categoryId && categories && categories.length > 0) {
        const categoryName = (transaction as unknown as Record<string, unknown>).category || (transaction as unknown as Record<string, unknown>).category_name;
        if (categoryName) {
                     console.log('EditTransactionDialog - Looking for category by name:', categoryName);
          
          const foundCategory = categories.find((cat: Record<string, unknown>) => 
            cat.name === categoryName || 
            (cat.name as string)?.toLowerCase() === (categoryName as string)?.toLowerCase()
          );
          
          if (foundCategory) {
            categoryId = foundCategory.id.toString();
            console.log('EditTransactionDialog - Found category ID from name:', categoryId);
          } else {
            console.log('EditTransactionDialog - Category not found in categories list');
          }
        }
      }
      
      console.log('EditTransactionDialog - Final accountId:', accountId);
      console.log('EditTransactionDialog - Final categoryId:', categoryId);
      console.log('EditTransactionDialog - Available accounts:', accounts);
      console.log('EditTransactionDialog - Available categories:', categories);
      
      setFormData({
        date: new Date(transaction.date),
        type: transaction.type || "INCOME", // Default to INCOME for income transactions
        accountId: accountId,
        categoryId: categoryId,
        amount: transaction.amount || 0,
        description: transaction.description || "",
      });
    } else {
      console.log('EditTransactionDialog - Conditions not met for form reset:', {
        hasTransaction: !!transaction,
        accountsLoading,
        categoriesLoading,
        accountsCount: accounts.length,
        categoriesCount: categories.length
      });
    }
  }, [transaction, categories, accounts, accountsLoading, categoriesLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.accountId || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Tanggal, akun, dan kategori wajib diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        id: transaction?.id || '',
        date: formData.date.toISOString().split('T')[0],
        type: formData.type,
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        amount: formData.amount,
        description: formData.description,
      });
      
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil diperbarui",
        variant: "success",
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui transaksi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <DateInput
                value={formData.date}
                onChange={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                data-testid="edit-tx-date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
                  <SelectItem value="INCOME">Pemasukan</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Akun</Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun" />
                </SelectTrigger>
                <SelectContent>
                  {accounts && accounts.length > 0 ? (
                    accounts.map((account: Record<string, unknown>) => (
                      <SelectItem key={(account.id as string | number)?.toString() || ''} value={(account.id as string | number)?.toString() || ''}>
                        {account.name as string}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      {accountsLoading ? 'Loading...' : 'No accounts available'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                Debug: {accounts?.length || 0} accounts, selected: {formData.accountId || 'none'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.length > 0 ? (
                    categories.map((category: Record<string, unknown>) => (
                      <SelectItem key={(category.id as string | number)?.toString() || ''} value={(category.id as string | number)?.toString() || ''}>
                        {category.name as string}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      {categoriesLoading ? 'Loading...' : 'No categories available'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                Debug: {categories?.length || 0} categories, selected: {formData.categoryId || 'none'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah</Label>
            <CurrencyInput
              value={formData.amount}
              onChange={(value) => setFormData(prev => ({ ...prev, amount: value || 0 }))}
              data-testid="edit-tx-amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Catatan</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Masukkan catatan transaksi"
              data-testid="edit-tx-description"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
