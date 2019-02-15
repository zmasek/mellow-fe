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

  const fileInput = $('#file-input');
  fileInput.on('change', (event) => {
    const fileName = fileInput.val();
    var cleanFileName = fileName.replace('C:\\fakepath\\', ' ')
    fileInput.next('.custom-file-label').html(cleanFileName);

    const file = fileInput.prop('files')[0];
    const reader = new FileReader();
    reader.addEventListener('load', function(event) {
      $('#text-input').val(event.target.result);
    });
    reader.readAsText(file);
  });

  $('#form').submit((event) => {
    event.preventDefault();
    const button = $('.btn');
    setLoading(button);

    const form = $('#form');
    const url = form.attr('action');
    const link = $('#link');

    $.ajax({
      method: form.attr('method').toUpperCase(),
      url: url,
      crossDomain: true,
      data: form.serialize(),
      dataType: 'json',
    }).done(function(data){
      if (data.status) {
        const error = $('#error');
        error.text(data.status);
        error.removeClass('d-none');
      } else {
        const contentType = 'application/xml';
        const blob = b64toBlob(data.file, contentType);
        const blobUrl = URL.createObjectURL(blob);
        link.attr('href', blobUrl);
        link[0].click();
      }
      unsetLoading(button);
    }).fail(function(data){
      console.log(data);
    });
  });
});
