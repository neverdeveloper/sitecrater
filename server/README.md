# Private API Server

## Установка

```bash
cd server
npm install
```

## Настройка

1. Скопируй `.env.example` в `.env`
2. Измени `JWT_SECRET` на свой секретный ключ

## Запуск

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход (требует токен)
- `GET /api/auth/verify` - Проверка токена

### User
- `GET /api/user/profile` - Профиль пользователя (требует токен)
- `GET /api/user/getNumberUser` - Количество пользователей
- `POST /api/user/updateHwid` - Обновить HWID (требует токен)

### Keys
- `POST /api/keys/generate` - Генерация ключа (только ADMIN)
- `POST /api/keys/activate` - Активация ключа (требует токен)
- `GET /api/keys/list` - Список всех ключей (только ADMIN)
- `DELETE /api/keys/:key` - Удалить ключ (только ADMIN)

## Безопасность

✅ Bcrypt для хеширования паролей (12 раундов)
✅ JWT токены с истечением (7 дней)
✅ Rate limiting (100 req/15min общий, 10 req/15min для auth)
✅ Helmet.js для HTTP заголовков
✅ Валидация всех входных данных
✅ Защита от SQL injection (prepared statements)
✅ Логирование попыток входа
✅ Блокировка после 5 неудачных попыток (15 минут)
✅ Автоочистка истекших сессий

## База данных

SQLite с таблицами:
- `users` - пользователи
- `sessions` - активные сессии
- `login_attempts` - попытки входа
