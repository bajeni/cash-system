// ID вашей Google таблицы
const SPREADSHEET_ID = '1vhXbHrnNvJ_i80PsZo6VFnstBQK8d95TVe4jguQwAz4';

/**
 * Обработчик GET запросов
 */
function doGet(e) {
  // Если это API запрос
  if (e.parameter.action) {
    try {
      const action = e.parameter.action;
      const store = e.parameter.store;
      
      let result;
      
      switch (action) {
        case 'getData':
          result = getStoreData(store);
          break;
          
        default:
          result = { success: false, error: 'Неизвестное действие' };
      }
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        
    } catch (error) {
      const errorResult = { success: false, error: error.toString() };
      
      return ContentService
        .createTextOutput(JSON.stringify(errorResult))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
  }
  
  // Если это обычный запрос для веб-приложения
  return HtmlService.createHtmlOutputFromFile('index.html')
    .setTitle('Система Кассовых Книг')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Обработчик POST запросов для API
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const store = data.store;
    
    let result;
    
    switch (action) {
      case 'getData':
        result = getStoreData(store);
        break;
        
      case 'saveData':
        result = saveStoreData(store, data.data);
        break;
        
      default:
        result = { success: false, error: 'Неизвестное действие' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
    
  } catch (error) {
    const errorResult = { success: false, error: error.toString() };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * Обработчик OPTIONS запросов для CORS
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Получение данных салона из Google Sheets
 */
function getStoreData(store) {
  try {
    console.log('Получение данных для салона:', store);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Таблица открыта:', spreadsheet.getName());
    
    // Используем один лист для всех салонов
    let sheet = spreadsheet.getSheetByName('CashData');
    if (!sheet) {
      console.log('Лист CashData не найден, создаем новый');
      sheet = spreadsheet.insertSheet('CashData');
      setupSheetHeaders(sheet);
    }
    
    console.log('Лист найден:', sheet.getName());
    
    const data = readSheetData(sheet, store);
    console.log('Данные прочитаны:', data);
    
    return { success: true, data: data };
    
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Сохранение данных салона в Google Sheets
 */
function saveStoreData(store, data) {
  try {
    console.log('Сохранение данных для салона:', store);
    console.log('Данные для сохранения:', data);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('CashData');
    
    if (!sheet) {
      console.log('Создаем новый лист CashData');
      sheet = spreadsheet.insertSheet('CashData');
      setupSheetHeaders(sheet);
    }
    
    console.log('Лист готов:', sheet.getName());
    
    writeSheetData(sheet, data, store);
    console.log('Данные сохранены успешно');
    
    return { success: true };
    
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Настройка заголовков листа
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Салон',
    'Дата',
    'Начальный остаток',
    'Источник дохода',
    'Доход',
    'Описание расхода',
    'Расход',
    'Описание изъятия',
    'Изъятие',
    'Конечный остаток'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}

/**
 * Чтение данных из листа
 */
function readSheetData(sheet, store) {
  const data = {
    initialBalance: 0,
    dailyData: {}
  };
  
  const range = sheet.getDataRange();
  
  if (range.getNumRows() <= 1) {
    return data; // Только заголовки
  }
  
  const values = range.getValues();
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const rowStore = row[0];
    const date = row[1];
    
    if (rowStore === store && date && date.toString().trim() !== '') {
      const dateStr = formatDateForStorage(date);
      data.dailyData[dateStr] = {
        startBalance: row[2] || 0,
        incomeSource: row[3] || '',
        income: row[4] || 0,
        expenseDesc: row[5] || '',
        expense: row[6] || 0,
        withdrawalDescription: row[7] || '',
        withdrawal: row[8] || 0,
        endBalance: row[9] || 0
      };
    }
  }
  
  return data;
}

/**
 * Запись данных в лист
 */
function writeSheetData(sheet, data, store) {
  // Удаляем старые данные для этого салона
  const range = sheet.getDataRange();
  if (range.getNumRows() > 1) {
    const values = range.getValues();
    const rowsToDelete = [];
    
    for (let i = values.length - 1; i >= 1; i--) {
      if (values[i][0] === store) {
        rowsToDelete.push(i + 1);
      }
    }
    
    // Удаляем строки снизу вверх
    rowsToDelete.forEach(rowIndex => {
      sheet.deleteRow(rowIndex);
    });
  }
  
  const rows = [];
  const dates = Object.keys(data.dailyData || {}).sort();
  
  dates.forEach(dateStr => {
    const dataRow = data.dailyData[dateStr];
    const date = new Date(dateStr);
    
    rows.push([
      store,
      date,
      dataRow.startBalance || 0,
      dataRow.incomeSource || '',
      dataRow.income || 0,
      dataRow.expenseDesc || '',
      dataRow.expense || 0,
      dataRow.withdrawalDescription || '',
      dataRow.withdrawal || 0,
      dataRow.endBalance || 0
    ]);
  });
  
  if (rows.length > 0) {
    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rows.length, 10).setValues(rows);
  }
}

/**
 * Форматирование даты для хранения
 */
function formatDateForStorage(date) {
  if (typeof date === 'string') {
    return date;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
