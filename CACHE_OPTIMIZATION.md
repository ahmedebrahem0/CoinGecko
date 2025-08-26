# تحسينات الأداء - React Query Cache

## المشكلة

كانت الصفحة الرئيسية تعيد تحميل البيانات كل مرة يتم فتحها، مما يسبب تأخيراً في الأداء وتجربة مستخدم سيئة.

## الحل

تم تطبيق React Query مع إعدادات cache محسنة لجميع الصفحات:

### 1. إعدادات React Query العامة (`src/main.jsx`)

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // لا يعيد التحميل عند التركيز على النافذة
      refetchOnMount: false, // لا يعيد التحميل عند إعادة التحميل
      refetchOnReconnect: false, // لا يعيد التحميل عند إعادة الاتصال
      keepPreviousData: true, // يحتفظ بالبيانات السابقة أثناء التحميل
      staleTime: 5 * 60 * 1000, // البيانات تعتبر "طازجة" لمدة 5 دقائق
      gcTime: 10 * 60 * 1000, // البيانات تُحذف من الذاكرة بعد 10 دقائق
    },
  },
});
```

### 2. إعدادات Cache لكل Hook

#### `useCoinsData` - البيانات الأساسية

- **Top Coins**: `staleTime: 5 minutes` - بيانات تتغير بسرعة
- **Trending Coins**: `staleTime: 10 minutes` - بيانات تتغير ببطء
- **Top Gainers**: `staleTime: 5 minutes` - بيانات تتغير بسرعة

#### `useGlobalStats` - الإحصائيات العامة

- **Global Stats**: `staleTime: 10 minutes` - بيانات تتغير ببطء

#### `usePoolsData` - بيانات Pools

- **Networks**: `staleTime: 10 minutes` - بيانات ثابتة نسبياً
- **Trending Pools**: `staleTime: 5 minutes` - بيانات تتغير بسرعة

### 3. الفوائد

✅ **أداء محسن**: البيانات لا تُحمل مرة أخرى لمدة 5-10 دقائق  
✅ **تجربة مستخدم أفضل**: لا توجد شاشات تحميل متكررة  
✅ **تقليل استهلاك API**: طلبات أقل للخادم  
✅ **استجابة أسرع**: البيانات تُعرض فوراً من الذاكرة

### 4. كيفية العمل

1. **المرة الأولى**: البيانات تُحمل من API وتُخزن في الذاكرة
2. **المرات التالية**: البيانات تُعرض من الذاكرة مباشرة
3. **بعد 5-10 دقائق**: البيانات تعتبر "قديمة" وتُحدث عند الحاجة

### 5. إعادة التحميل اليدوي

إذا كنت تريد تحديث البيانات يدوياً، يمكنك استخدام:

```javascript
const { refetch } = useCoinsData();
// أو
const { refetch: refetchGlobal } = useGlobalStats();

// إعادة التحميل
refetch();
refetchGlobal();
```

## ملاحظات مهمة

- البيانات تُحدث تلقائياً عند العودة للصفحة بعد 5-10 دقائق
- يمكن تعديل `staleTime` حسب احتياجات كل نوع بيانات
- النظام يعمل بشكل مثالي مع React Router للتنقل بين الصفحات











