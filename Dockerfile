FROM tourdeapp/php-8.1

COPY . /app
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
