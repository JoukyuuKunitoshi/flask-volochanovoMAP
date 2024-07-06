initMap();

let mapFocus;

let nearObject = false;

let content = document.getElementById("info-content")


function getObject(place) {
  return fetch(`/attractions?obj=${place}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
        

        
          return data;

      })
      .catch(error => {
          console.error('Ошибка:', error);
          return null; 
      });
      
}


function menuLink(place){
  getObject(place)
            .then(data => {
                content.innerHTML = data;
                content.scrollTo({
                  top: 0,
                  behavior: 'smooth'
              });
            });
            
            
}


function menu(){
fetch(`/menu`)
          .then(response => response.text())
          .then(data => {
            content.innerHTML = data
            console.log("menu script")
            const urlParams = new URLSearchParams(window.location.search);
                    let element = document.getElementById('green-arrow-link');
                    if (urlParams.toString()) {
                        element.style.display = 'none';
                    }
                     console.log("android app checkd")
          }
        
        )
          .catch(error => console.error('Ошибка:', error));
}
menu()

async function initMap() {
  console.log("initMap")
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapFeature, YMapMarker } = ymaps3;

  const map = new YMap(
    // Pass the link to the HTMLElement of the container
    document.getElementById('map'),
    // Pass the map initialization parameters
    {
      location: {
        center: [35.296703, 56.019862], // 1 - чем ниже тем левее 2 - чем ниже тем ниже ширина 19 дома: 19м
        zoom: 16
      },
      behaviors: ['pinchRotate', 'drag', 'panTilt', 'pinchZoom', 'scrollZoom', 'dblClick'],
      showScaleInCopyrights: true,
    },
    [
      // Add a map scheme layer
      new YMapDefaultSchemeLayer({}),
      // Add a layer of geo objects to display the line
      new YMapDefaultFeaturesLayer({})
    ]
  );

  // const markerElement = document.createElement('div');
  // markerElement.className = 'marker-class';
  // markerElement.style.display = 'none';

  // const marker = new YMapMarker(
  //   {
  //     coordinates: [37.2432984, 55.6834147],    я не помню зачем это делал, но без него кажется все работает
  //     draggable: false,
  //     mapFollowsOnDrag: true
  //   },
  //   markerElement
  // );

  // map.addChild(marker);




  let attractions = {}; // это словарь

  attractions.pond = new YMapFeature({
    geometry: {
      type: 'LineString',
      coordinates: [
        [35.286360, 56.021586], // 1 - чем ниже тем левее 2 - чем ниже тем ниже
        [35.291703, 56.021586],
        [35.291703, 56.019890],
        [35.286360, 56.019890],
        [35.286360, 56.021586]
      ]
    },
    style: { stroke: [{ color: '#56a85b', width: 2 }] }
  });

  attractions.shop = new YMapFeature({
    geometry: {
      type: 'LineString',
      coordinates: [
        [35.291872, 56.018966], // 1 - чем ниже тем левее 2 - чем ниже тем ниже
        [35.292372, 56.018966],
        [35.292372, 56.018566],
        [35.291872, 56.018566],
        [35.291872, 56.018966]
      ]
    },
    style: { stroke: [{ color: '#56a85b', width: 2 }] }
  });

  attractions.chapel = new YMapFeature({
    geometry: {
      type: 'LineString',
      coordinates: [
        [35.302870, 56.016915], // 1 - чем ниже тем левее 2 - чем ниже тем ниже
        [35.303300, 56.016915],
        [35.303300, 56.017155],
        [35.302870, 56.017155],
        [35.302870, 56.016915]
      ]
    },
    style: { stroke: [{ color: '#56a85b', width: 2 }] }
  });


  attractions.mounds = new YMapFeature({
    geometry: {
      type: 'LineString',
      coordinates: [
        [35.299238, 56.028771], // Верхний левый угол
        [35.307169, 56.028771], // Верхний правый угол
        [35.307169, 56.026893], // Нижний правый угол
        [35.299238, 56.026893], // Нижний левый угол
        [35.299238, 56.028771]  // Замыкаем квадрат, возвращаясь к верхнему левому углу
      ]
    },
    style: { stroke: [{ color: '#56a85b', width: 2 }] }
  });
  // attractions.moscow = new YMapFeature({
  //   geometry: {
  //     type: 'LineString',
  //     coordinates: [
  //       [37.616, 55.756], // верхний левый угол
  //       [37.618, 55.756], // верхний правый угол
  //       [37.618, 55.754], // нижний правый угол
  //       [37.616, 55.754], // нижний левый угол
  //       [37.616, 55.756]  // возвращаемся в верхний левый угол
  //     ]
  //   },
  //   style: { stroke: [{ color: '#56a85b', width: 2 }] }
  // });











  // Функция для вычисления границ
  function getBoundaries(coordinates) {
    let lons = coordinates.map(coord => coord[0]);
    let lats = coordinates.map(coord => coord[1]);

    let topLeft = [Math.min(...lons), Math.max(...lats)];
    let bottomRight = [Math.max(...lons), Math.min(...lats)];

    return { topLeft, bottomRight };
  }

  // Вычисляем границы для всех достопримечательностей и сохраняем их
  let boundaries = {};
  for (let place in attractions) {
    let coordinates = attractions[place].geometry.coordinates;
    boundaries[place] = getBoundaries(coordinates);
  }

  console.log(boundaries)

  // Добавляем объекты на карту
  for (let key in attractions) {
    if (attractions.hasOwnProperty(key)) {
      map.addChild(attractions[key]);
    }
  }


  // Функция для проверки, находится ли точка внутри области
  function isInsideArea(position, topLeft, bottomRight) {
    let [lon, lat] = position;
    let [lon1, lat1] = topLeft;
    let [lon2, lat2] = bottomRight;

    return lon >= lon1 && lon <= lon2 && lat <= lat1 && lat >= lat2;
  }


  function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }

  let options = {
    enableHighAccuracy: true,
  };

  
  navigator.geolocation.watchPosition(showPosition, error, options);


 






//menuLink("mounts")

  function showPosition (position) {
    let lon = position.coords.latitude;
    let lat = position.coords.longitude;

    //lon = 55.724680
    // lat = 37.460391

    console.log(lon, lat);

    mapFocus = function(){
      map.setLocation({
        center: [lat, lon],
        zoom: 16
      })
    }

    let pastMarker = document.querySelector('.marker-wrapper');
    if (pastMarker) {
      pastMarker.remove()
    }


    const markerWrapper = document.createElement('div')
    markerWrapper.className = 'marker-wrapper'
    const markerElement = document.createElement('div');
    markerElement.className = 'marker-class';

    const viewAngleElement = document.createElement('div')
    viewAngleElement.className = 'view-angle'

    markerWrapper.appendChild(viewAngleElement)
    markerWrapper.appendChild(markerElement)

    const marker = new YMapMarker(
      {
        coordinates: [lat, lon],
      },
      markerWrapper
    );

    map.addChild(marker);




    let isInArea = false
    for (let place in boundaries) {
      if (isInsideArea([lat, lon], boundaries[place].topLeft, boundaries[place].bottomRight)) {
        isInArea = true
        if(nearObject === false){

          console.log(`You are inside the ${place}`);



          getObject(place)
            .then(data => {
                content.innerHTML = data;
                content.scrollTo({
                  top: 0,
                  behavior: 'smooth'
              });
            });

            }

          nearObject = true;
          break
    
        }
      
      
    }
    if (!isInArea){
      nearObject = false
    }
  }



  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
        let mapRotationDegrees = map.azimuth * (180 / Math.PI);

        updateCSSRule('.view-angle', '--degree', -event.alpha - 18 + mapRotationDegrees + 'deg');
    }, true);
  }

}

function locate() {
  console.log(showPosition)
  let id = navigator.geolocation.watchPosition(showPosition);
}


let cachedRule = null

function updateCSSRule(selector, property, value) {
  if (cachedRule) {
    // Если правило уже закэшировано, изменяем его напрямую
    cachedRule.style.setProperty(property, value);
    return;
  }

  // Ищем все таблицы стилей, загруженные на страницу
  for (const styleSheet of document.styleSheets) {
    // Обрабатываем только таблицы стилей, не относящиеся к другим доменам (чтобы избежать ошибок CORS)
    if (styleSheet.href && !styleSheet.href.startsWith(window.location.origin)) {
      continue;
    }

    try {
      // Перебираем все правила в таблице стилей
      for (const rule of styleSheet.cssRules) {
        // Если это правило для нужного селектора
        if (rule.selectorText === selector) {
          // Устанавливаем новое значение для CSS-переменной
          rule.style.setProperty(property, value);

          cachedRule = rule;
          return;
        }
      }
    } catch (e) {
      console.warn(`Не удалось изменить правило стиля: ${e}`);
    }
  }
}




// 

// Исправить отображение маркера
// проверить расчёт границ
// панорама


          // | №   | Наименование объекта                         | текст   | фото      | Дата отправки | карта | HTML | Координаты           | скрипт | attractions. |
          // |-----|----------------------------------------------|---------|-----------|---------------|-------|------|----------------------|--------|--------------|
          // | 1   | Каскад прудов                                | 1 файл  | 13 файлов | 15 05 2024    |  +    |  +   | 35.286360, 56.021586 |   +    |   pound      |
          // | 2   | Парк Шереметевых                             | 1 файл  | 62 файла  | 16 05 2024    |       |  +   |                      |   +    |              |
          // | 3   | Часовня                                      | 1 файл  | 14 файлов | 17 05 2024    |  +    |      | 35.302870, 56.016915 |   +    |   chapel     |
          // | 4   | Народный театр Римских-Корсаковых (Асонов)   | 1 файл  | 13 файлов | 17 05 2024    |       |  +   |                      |   +    |              |
          // | 5   | Липовая аллея                                | 1 файл  | 7 файлов  | 17 05 2024    |       |      |                      |   +    |              |
          // | 6   | Детская площадка                             |         |           |               |       |      |                      |   +    |              |
          // | 7   | СДК                                          |         |           |               |       |      |                      |   +    |              |
          // | 8   | Источник                                     |         |           |               |       |      |                      |   +    |              |
          // | 9   | Курганы                                      | 1 файл  | 4 файла   | 17 05 2024    |   +   |  +   |                      |   +    |   mounds     |
          // | 10  | Старое кладбище                              |         |           |               |       |      |                      |   +    |              |
          // | 11  | Новое кладбище                               |         |           |               |       |      |                      |   +    |              |
          // | 12  | Знаменная площадь                            |         |           |               |       |      |                      |   +    |              |
          // | 13  | Котеджи для отдыха Роговы                    |         |           |               |       |      |                      |   +    |              |
          // | 14  | Магазин                                      | 1 файл  | 5 файлов  | 17 05 2024    |   +   |  +   | 35.291872, 56.018966 |   +    |   shop       |
          // | 15  | Руины старой церкви                          |         |           |               |       |      |                      |   +    |              |
          // | 16  | Зимний санный спуск                          |         |           |               |       |      |                      |   +    |              |
         