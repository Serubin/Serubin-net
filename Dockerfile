FROM jekyll/jekyll AS builder

WORKDIR /opt/serubin-net/

# Cache yarn layer
COPY package.json ./
RUN yarn

COPY . /opt/serubin-net/
RUN chown  -R jekyll:jekyll /opt/serubin-net

# Build node/js/scss assets
RUN yarn build:node

# Build static site
RUN bundle install
RUN yarn build:static

# Load image
FROM nginx:alpine
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/serubin-net/dist /var/www/html
