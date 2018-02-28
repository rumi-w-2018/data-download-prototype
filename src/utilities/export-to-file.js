
const processCsvColumns = ( rowColumns ) => {
    let finalVal = '';
    rowColumns.forEach( (column, i) => {
        const innerValue = column === null ? '' : column.toString();
        let result = innerValue.replace(/"/g, '""');

        if (result.search(/[",\n]/g) >= 0) { result = '"' + result + '"'; }
        if(i > 0){ finalVal += ','; }
        finalVal += result;
    });

    return finalVal + '\n';
};

const processTextColumns = ( rowColumns ) => {
    let finalVal = '';

    rowColumns.forEach( (column, i) => {
        const innerValue = column === null ? '' : column.toString();
        let result = innerValue.replace(/"/g, '""');

        if (result.search(/[",\n]/g) >= 0) { result = '"' + result + '"'; }
        if(i > 0) { finalVal += '\r\n'; }
        finalVal += result;
    });

    return finalVal + '\r\n';
};

export const exportToFile = (filename, rows, type) => {

    let csvStr = '';

    if(type === 'csv'){
        rows.forEach( row => {
            csvStr += processCsvColumns(row);
        }, this);

    }else{  // Text
        rows.forEach( row => {
            csvStr += processTextColumns(row);
        }, this);
    }

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    }else {
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

};