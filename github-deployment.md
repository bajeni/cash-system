# 🚀 Развертывание на GitHub Pages
## Дата: 29.08.2025

---

## 🎯 **Преимущества GitHub Pages:**
- ✅ Быстрая загрузка
- ✅ Простые обновления
- ✅ Надежность
- ✅ Данные в Google Sheets
- ✅ Бесплатно

---

## 📋 **Необходимые файлы:**

1. **`index.html`** - главная страница
2. **`google_apps_script.js`** - серверная логика
3. **`README.md`** - описание проекта
4. **`.gitignore`** - исключения для Git

---

## 🚀 **Пошаговая инструкция:**

### **Шаг 1: Создание репозитория**

1. **Откройте GitHub** и создайте новый репозиторий
2. **Название:** `cash-system` или `кассовая-система`
3. **Публичный** репозиторий (для бесплатного GitHub Pages)

### **Шаг 2: Подготовка файлов**

1. **Переименуйте файлы:**
   - `Система_кассовых_книг_29.08.2025.html` → `index.html`
   - `Google_Apps_Script_29.08.2025.js` → `google_apps_script.js`

2. **Создайте `.gitignore`:**
   ```
   .DS_Store
   *.log
   node_modules/
   ```

3. **Создайте `README.md`:**
   ```markdown
   # 💰 Система кассовых книг
   
   Веб-приложение для управления кассовыми операциями салонов.
   
   ## 🚀 Демо
   [Ссылка на GitHub Pages]
   
   ## 🔧 Технологии
   - HTML5, CSS3, JavaScript
   - Google Sheets API
   - GitHub Pages
   ```

### **Шаг 3: Загрузка в GitHub**

```bash
# Инициализация Git
git init
git add .
git commit -m "Initial commit: Cash system"

# Добавление удаленного репозитория
git remote add origin https://github.com/YOUR_USERNAME/cash-system.git
git branch -M main
git push -u origin main
```

### **Шаг 4: Настройка GitHub Pages**

1. **Перейдите в Settings** репозитория
2. **Найдите "Pages"** в левом меню
3. **Source:** Deploy from a branch
4. **Branch:** main
5. **Folder:** / (root)
6. **Сохраните**

### **Шаг 5: Настройка Google Apps Script**

1. **Создайте новый проект** в Google Apps Script
2. **Скопируйте код** из `google_apps_script.js`
3. **Создайте развертывание** как веб-приложение
4. **Скопируйте URL** развертывания

### **Шаг 6: Обновление URL в HTML**

1. **Откройте `index.html`**
2. **Замените URL:**
   ```javascript
   const GOOGLE_SCRIPT_URL = 'ВАШ_НОВЫЙ_URL_ОТ_РАЗВЕРТЫВАНИЯ';
   ```
3. **Сохраните и загрузите в GitHub:**
   ```bash
   git add .
   git commit -m "Update Google Apps Script URL"
   git push
   ```

---

## 🔧 **Структура проекта:**

```
cash-system/
├── index.html              # Главная страница
├── google_apps_script.js   # Серверная логика (для справки)
├── README.md              # Описание проекта
├── .gitignore             # Исключения Git
└── docs/                  # Документация (опционально)
    ├── deployment.md
    └── passwords.md
```

---

## 🌐 **URL вашего приложения:**

После настройки GitHub Pages:
```
https://YOUR_USERNAME.github.io/cash-system/
```

---

## 🔄 **Обновления:**

Для обновления приложения:
```bash
git add .
git commit -m "Update: описание изменений"
git push
```

GitHub Pages автоматически обновит сайт.

---

## 📞 **Поддержка:**

При проблемах:
1. Проверьте настройки GitHub Pages
2. Убедитесь, что репозиторий публичный
3. Проверьте консоль браузера на ошибки

---

**🎉 Готово! Ваше приложение доступно на GitHub Pages!**
