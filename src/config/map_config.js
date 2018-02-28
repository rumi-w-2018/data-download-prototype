export const basemaps = [
        {
            'id': 'topo',
            'layerType': 'baselayer',
            'name': 'USGS Topo',
            'minZoomLevel': '3',
            'maxZoomLevel': '16',
            'layers': [],
            'serviceType': 'tiled',
            'transparent': true,
            'opacity': '1.0',
            'url': 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer',
            'attribution': '<a href="https://nationalmap.gov/">The National Map</a>'
        },
        {
            'id': 'imageryTopo',
            'layerType': 'baselayer',
            'name': 'USGS Imagery Topo',
            'minZoomLevel': '3',
            'maxZoomLevel': '16',
            'layers': [],
            'serviceType': 'tiled',
            'transparent': true,
            'opacity': '1.0',
            'url': 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer',
            'attribution': '<a href="https://nationalmap.gov/">The National Map</a>'
        },
        {
            'id': 'shadedRelief',
            'layerType': 'baselayer',
            'name': 'USGS Shaded Relief',
            'minZoomLevel': '3',
            'maxZoomLevel': '16',
            'layers': [],
            'serviceType': 'tiled',
            'transparent': true,
            'opacity': '1.0',
            'url': 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer',
            'attribution': '<a href="https://nationalmap.gov/">The National Map</a>'
        },
        {
            'id': 'usaTopoMaps',
            'layerType': 'baselayer',
            'name': 'USA Topo Maps',
            'minZoomLevel': '3',
            'maxZoomLevel': '16',
            'layers': [],
            'serviceType': 'tiled',
            'transparent': true,
            'opacity': '1.0',
            'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer',
            'attribution': '<a href="https://esri.com/">ESRI</a>'
        }
    ];

export const selectablePolys = [
        {
            'id': 'statePolygons',
            'layerType':'selectable-polygons',
            'name' : 'U.S. State or Territory',
            'minZoomLevel': '',
            'maxZoomLevel': '',
            'layers':[1],
            'identifyLayer': 'visible:1',
            'polyType': 'state',
            'serviceType': 'dynamic',
            'transparent': true,
            'opacity':'1.0',
            'url': 'https://services.nationalmap.gov/arcgis/rest/services/selectable_polygons/MapServer',
            'legend': ''
        },
        {
            'id': 'countyPolygons',
            'layerType':'selectable-polygons',
            'name' : 'County or Equivalent',
            'minZoomLevel': '7',
            'maxZoomLevel': '',
            'layers':[3],
            'identifyLayer': 'visible:3',
            'polyType': 'county',
            'serviceType': 'dynamic',
            'transparent': true,
            'opacity':'1.0',
            'url': 'https://services.nationalmap.gov/arcgis/rest/services/selectable_polygons/MapServer',
            'legend': ''
        }
    ];