
# Build mapgen in a container
FROM ubuntu:20.04 as build
RUN apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y \
    mingw-w64

RUN mkdir -p /build/map
COPY ./map /build/map
COPY ./build.mapgen.sh /build

WORKDIR /build
RUN ./build.mapgen.sh

# Make a run environment with nodejs and wine
FROM tianon/wine

RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash \
    && apt-get install nodejs -yq

ENV WINEARCH=win32
ENV WINEDEBUG=-all

COPY --from=build /build/bin/d2-map.exe /app/bin/d2-map.exe

VOLUME [ "/app/game" ]

WORKDIR /app
ADD dist/ /app/

# Make sure InstallPath exists inside the registry
COPY d2.install.reg /app/
CMD ["node", "index.js"]
