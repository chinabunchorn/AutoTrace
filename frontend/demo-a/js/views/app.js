// every page is a string in VIEWS, template.js turns them into React elements
const VIEWS = {};

VIEWS.app = `
<div class="page">
  <sc-view name="header"></sc-view>
  <sc-if value="{{show.upload}}"><sc-view name="select"></sc-view></sc-if>
  <sc-if value="{{show.review}}"><sc-view name="review"></sc-view></sc-if>
  <sc-if value="{{show.loading}}"><sc-view name="loading"></sc-view></sc-if>
  <sc-if value="{{show.result}}"><sc-view name="result"></sc-view></sc-if>
  <sc-if value="{{show.ring}}"><sc-view name="ring"></sc-view></sc-if>
</div>
`;
