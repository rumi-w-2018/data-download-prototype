import React from 'react';
import Moment from 'moment';
import { map } from 'lodash';
import { exportToFile } from '../utilities/export-to-file';
import { getProdFootprintBounds } from '../utilities/coordinates';

const getDownloadFileName = (link) => {
    let fName = '';
    if(link.match(/\//) !== null){
        const temp = link.split('/');
        const fNameWithExt = (temp[temp.length-1]).trim();
        if(fNameWithExt.match(/\./) !== null){
            const temp2 = fNameWithExt.split('.');
            fName = (temp2[0]).trim();
        }else fName = fNameWithExt;
    }

    return fName;
};

const SaveAsCsv = (props) => {

    const writeToCsv = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const exportArray = [];
        const headerArray = ['Title', 'FileFormat', 'BoundingBox', 'Thumbnail', 'Metadata', 'FileName', 'URL', 'URL2'];
        exportArray.push(headerArray);

        map(props.savedProducts, product => {

            const rowArray = [];
            const bboxArray = getProdFootprintBounds(product.boundingBox); //[left, bottom, right, top];
            const bboxStr = bboxArray[0][1].toFixed(4) + ',' + bboxArray[0][0].toFixed(4) + ',' + bboxArray[1][1].toFixed(4) + ',' + bboxArray[1][0].toFixed(4);

            // For CSV Export
            rowArray.push(product.title);
            rowArray.push(product.format);
            rowArray.push(bboxStr);
            rowArray.push(product.previewGraphicURL);
            rowArray.push(product.metaUrl);

            product.productDownload.forEach( (download, i) => {
                if( i === 0){
                    const fileName = getDownloadFileName(product[download.name]);
                    rowArray.push(fileName);
                }
                rowArray.push(product[download.name]);
            });
            exportArray.push(rowArray);
        });

        const exportFileName = 'savedProducts_' + Moment().format('YYYYMMDD_HHmmss') + '.csv';
        exportToFile(exportFileName, exportArray, 'csv');
    };

    return (
        <button className="btn btn-sm btn-secondary" onClick={writeToCsv.bind(this)} style={{fontSize:'1em', height:'2em', padding:'1px 10px'}}>Export As CSV</button>
    );

};

export default SaveAsCsv;

