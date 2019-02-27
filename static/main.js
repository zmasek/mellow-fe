$(() => {
  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };

  const setLoading = (button) => {
    button.prop('disabled', true);
    button.children('.spinner-border').removeClass('d-none');
  };

  const unsetLoading = (button) => {
    button.prop('disabled', false);
    button.children('.spinner-border').addClass('d-none');
  };

  const setError = (element, text) => {
    element.text(text);
    element.removeClass('d-none');
  };

  const unsetError = (element) => {
    element.text('');
    element.addClass('d-none');
  };

  const removeDragData = (event) => {
    if (event.originalEvent.dataTransfer.items) {
      event.originalEvent.dataTransfer.items.clear();
    } else {
      event.originalEvent.dataTransfer.clearData();
    }
  }

  const overlay = $('#overlay');
  const fileInput = $('#file-input');
  const dropZone = $('body');
  dropZone.on('drop', (event) => {
    event.preventDefault();
    fileInput.prop('files', event.originalEvent.dataTransfer.files);
    removeDragData(event)
    overlay.hide();
    fileInput.trigger('change');
  });
  dropZone.on('dragover', (event) => {
    event.preventDefault();
    overlay.show();
  });

  const button = $('.btn');
  const textInput = $('#text-input');
  fileInput.on('change', (event) => {
    setLoading(button);
    const fileName = fileInput.val();
    var cleanFileName = fileName.replace('C:\\fakepath\\', ' ')
    fileInput.next('.custom-file-label').html(cleanFileName);

    const file = fileInput.prop('files')[0];
    const reader = new FileReader();
    reader.addEventListener('load', function(event) {
      textInput.val(event.target.result);
      unsetLoading(button);
    });
    reader.readAsText(file);
  });

  textInput.on('input', (event) => {
    if (event.originalEvent.target.value) {
      button.prop('disabled', false);
    } else {
      button.prop('disabled', true);
    }
  });

  const form = $('#form');
  const url = form.attr('action');
  const method = form.attr('method').toUpperCase();
  const link = $('#link');
  const error = $('#error');
  form.submit((event) => {
    event.preventDefault();
    unsetError(error);
    setLoading(button);

    $.ajax({
      method: method,
      url: url,
      crossDomain: true,
      data: form.serialize(),
      dataType: 'json',
    }).done(function(data){
      if (data.status) {
        setError(error, data.status);
      } else {
        const contentType = 'application/xml';
        const blob = b64toBlob(data.file, contentType);
        const blobUrl = URL.createObjectURL(blob);
        link.attr('href', blobUrl);
        link[0].click();
      }
      unsetLoading(button);
    }).fail(function(jqXHR, textStatus){
      let errorText = textStatus;
      if (jqXHR.status === 400) {
        errorText = jqXHR.responseJSON.status;
      }
      setError(error, errorText);
      unsetLoading(button);
    });
  });
});
