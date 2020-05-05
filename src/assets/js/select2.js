$(".select2_demo_2").select2({
    placeholder: "Select a state",
    allowClear: true,
    tags: true,
    placeholder: 'email(s)',
    createTag: function (params) {
        // Don't offset to create a tag if there is no @ symbol
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(params.term)) {
          // Return null to disable tag creation
          return {
            id: params.term,
            text: params.term
          }
        }
    
        return null
      }
});