import { connect } from 'react-redux';
import actions from '../../store/reducer/actions';

import Homepage from './Homepage';

const mapStateToProps = state => ({
	companies: state.companies,
	profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
	getAllCompanies: () => dispatch(actions.getAllCompaniesRequest()),
	getCompanyProfile: ticker => dispatch(actions.getCompanyProfileRequest(ticker)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
