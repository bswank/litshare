
function editCommunityModalControl(communityId) {
  $(`#edit${communityId}CommunityModal--trigger`).click(function() {
    $(`#edit${communityId}CommunityModal`).fadeIn('fast');
    $('body').addClass('no-scroll');
  });
}
