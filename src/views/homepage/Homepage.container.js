import { connect } from 'react-redux';
import actions from '../../store/reducer/actions';

import Homepage from './Homepage';

const mapStateToProps = state => ({
	companies: state.companies,
});

const mapDispatchToProps = dispatch => ({
	getAllCompanies: () => dispatch(actions.getAllCompaniesRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
