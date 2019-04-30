package org.citopt.connde.service.cep.core.queries;

import org.citopt.connde.service.cep.core.queries.output.CEPOutput;

/**
 * Interface for CEP query subscribers,
 */
public interface CEPQuerySubscriber {
    /**
     * This method is called in case the CEP engine recognizes the pattern as defined in the corresponding CEP query.
     * In addition, the output of the query is passed as parameter.
     *
     * @param outputColumns The output of the CEP query
     */
    void onQueryTriggered(CEPOutput outputColumns);
}
