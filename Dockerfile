FROM jekyll/jekyll AS builder

WORKDIR /opt/serubin-net/

# Cache yarn and gem layer
COPY package.json ./
COPY Gemfile ./
COPY Gemfile.lock ./

RUN yarn
RUN bundle install

COPY . /opt/serubin-net/
RUN chown  -R jekyll:jekyll /opt/serubin-net

USER jekyll

# Build node/js/scss assets
RUN yarn build:assets

# Build static site
RUN yarn build:static

# Load image
FROM nginx:alpine
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /opt/serubin-net/dist /var/www/html
