require('aframe');

AFRAME.registerComponent('figma', {
    schema: {
        page_url: { type: 'string' },
        access_token: { type: 'string' }
    },

    getNodeId: function(page_url) {
        const parser = document.createElement('a');
        parser.href = page_url;
        return decodeURIComponent(parser.search).replace('?node-id=','');
    },

    getFileKey: function(page_url) {
        const parser = document.createElement('a');
        parser.href = page_url;
        return parser.pathname.replace('/file/', '').replace(/\/.*/,'');
    },

    apiRequest: function(endpoint) {
        return fetch('https://api.figma.com/v1' + endpoint, {
            method: 'GET',
            headers: {
                'x-figma-token': this.data.access_token
            }
        }).then(function(response) {
            return response.json();
        }).catch(function (error) {
            return { err: error };
        });
    },

    init: function () {
        var self = this;
        var nodeId = this.getNodeId(this.data.page_url);
        var fileKey = this.getFileKey(this.data.page_url);

        console.log('requesting image from Figma');

        this.apiRequest('/images/' + fileKey + '?ids=' + nodeId)
        .then(function (apiResponse) {
            self.addImageToCanvas(apiResponse.images[nodeId]);
        });
    },

    addImageToCanvas: function(image_url) {
        console.log('Figma returned an image!', image_url);
        this.el.setAttribute('material', { src: image_url });
    },

    update: function () {},
    tick: function () {},
    remove: function () {},
    pause: function () {},
    play: function () {},
});